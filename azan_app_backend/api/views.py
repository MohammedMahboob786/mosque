from django.shortcuts import render

# Create your views here.
import MySQLdb
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
import uuid
from datetime import datetime, timedelta
import jwt
import bcrypt
from functools import wraps
from rest_framework.response import Response

def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization header missing"}, status=401)

        token = auth_header.split(" ")[1]
        try:
            decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
            request.mosque_id = decoded['mosque_id']
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=401)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=401)

        return view_func(request, *args, **kwargs)
    return wrapper


def get_db_connection():
    return MySQLdb.connect(
        host=settings.DATABASES['default']['HOST'],
        user=settings.DATABASES['default']['USER'],
        password=settings.DATABASES['default']['PASSWORD'],
        database=settings.DATABASES['default']['NAME']
    )


@api_view(['POST'])
def register_mosque(request):
    data = request.data
    db = get_db_connection()
    cursor = db.cursor()

    mosque_id = "MSJID_" + str(uuid.uuid4().hex[:8]).upper()

    # ✅ Hash the password
    plain_password = data.get('password')
    if not plain_password:
        return Response({"error": "Password is required"}, status=400)
    hashed_password = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt())

    # ✅ Insert into mosque table
    cursor.execute("""
        INSERT INTO mosque (mosque_id, name, location, admin_email, password)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        mosque_id,
        data.get('name'),
        data.get('location'),
        data.get('admin_email'),
        hashed_password
    ))

    db.commit()
    db.close()

    return Response({
        "message": "Mosque registered successfully",
        "mosque_id": mosque_id
    })


@api_view(['POST'])
def mosque_admin_login(request):
    data = request.data
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        SELECT mosque_id, password FROM mosque WHERE admin_email = %s
    """, (data.get('admin_email'),))
    row = cursor.fetchone()
    db.close()

    if row:
        mosque_id, hashed_password = row
        if bcrypt.checkpw(data.get('password').encode(), hashed_password.encode()):
            payload = {
                "mosque_id": mosque_id,
                "exp": datetime.utcnow() + timedelta(hours=12)
            }
            token = jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')

            return Response({
                "message": "Login successful",
                "token": token
            })
        else:
            return Response({"error": "Invalid password"}, status=401)
    else:
        return Response({"error": "Admin not found"}, status=404)

@api_view(['POST'])
@admin_required
def update_azan_timings(request):
    data = request.data
    mosque_id = request.mosque_id
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        REPLACE INTO azan_timings (mosque_id, fajr, zuhr, asr, maghrib, isha)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        mosque_id,
        data.get('fajr'),
        data.get('zuhr'),
        data.get('asr'),
        data.get('maghrib'),
        data.get('isha')
    ))

    db.commit()
    db.close()

    return Response({"message": "Azan timings updated"})


@api_view(['POST'])
@admin_required
def update_namaz_timings(request):
    data = request.data
    mosque_id = request.mosque_id
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        REPLACE INTO namaz_timings (mosque_id, fajr, zuhr, asr, maghrib, isha)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        mosque_id,
        data.get('fajr'),
        data.get('zuhr'),
        data.get('asr'),
        data.get('maghrib'),
        data.get('isha')
    ))

    db.commit()
    db.close()

    return Response({"message": "Namaz timings updated"})


@api_view(['GET'])
def get_timings_for_user(request, mosque_id):
    db = get_db_connection()
    cursor = db.cursor()

    # Get latest Azan timings
    cursor.execute("""
        SELECT fajr, zuhr, asr, maghrib, isha, updated_at
        FROM azan_timings WHERE mosque_id = %s
    """, (mosque_id,))
    azan_row = cursor.fetchone()

    # Get latest Namaz timings
    cursor.execute("""
        SELECT fajr, zuhr, asr, maghrib, isha, updated_at
        FROM namaz_timings WHERE mosque_id = %s
    """, (mosque_id,))
    namaz_row = cursor.fetchone()

    db.close()

    return Response({
        "azan_timings": {
            "fajr": str(azan_row[0]) if azan_row else None,
            "zuhr": str(azan_row[1]) if azan_row else None,
            "asr": str(azan_row[2]) if azan_row else None,
            "maghrib": str(azan_row[3]) if azan_row else None,
            "isha": str(azan_row[4]) if azan_row else None,
            "updated_at": str(azan_row[5]) if azan_row else None
        },
        "namaz_timings": {
            "fajr": str(namaz_row[0]) if namaz_row else None,
            "zuhr": str(namaz_row[1]) if namaz_row else None,
            "asr": str(namaz_row[2]) if namaz_row else None,
            "maghrib": str(namaz_row[3]) if namaz_row else None,
            "isha": str(namaz_row[4]) if namaz_row else None,
            "updated_at": str(namaz_row[5]) if namaz_row else None
        }
    })


# @api_view(['POST'])
# def subscribe_user_to_mosque(request):
#     data = request.data
#     db = get_db_connection()
#     cursor = db.cursor()

#     cursor.execute("""
#         INSERT INTO user_subscription (user_id, mosque_id)
#         VALUES (%s, %s)
#     """, (
#         data.get('user_id'),
#         data.get('mosque_id')
#     ))

#     db.commit()
#     db.close()

#     return Response({"message": "User subscribed successfully"})

@api_view(['GET'])
def get_user_subscriptions(request, user_id):
    db = get_db_connection()
    cursor = db.cursor()

    # Get all mosque_ids the user is subscribed to
    cursor.execute("""
        SELECT m.mosque_id, m.name
        FROM user_subscription us
        JOIN mosque m ON us.mosque_id = m.mosque_id
        WHERE us.user_id = %s
    """, (user_id,))
    mosque_rows = cursor.fetchall()

    subscriptions = []

    for mosque_id, mosque_name in mosque_rows:
        # Fetch azan timings
        cursor.execute("""
            SELECT fajr, zuhr, asr, maghrib, isha FROM azan_timings
            WHERE mosque_id = %s
        """, (mosque_id,))
        azan_row = cursor.fetchone()

        # Fetch namaz timings
        cursor.execute("""
            SELECT fajr, zuhr, asr, maghrib, isha FROM namaz_timings
            WHERE mosque_id = %s
        """, (mosque_id,))
        namaz_row = cursor.fetchone()

        subscriptions.append({
            "mosque_id": mosque_id,
            "mosque_name": mosque_name,
            "azan_timings": {
                "fajr": azan_row[0] if azan_row else None,
                "zuhr": azan_row[1] if azan_row else None,
                "asr": azan_row[2] if azan_row else None,
                "maghrib": azan_row[3] if azan_row else None,
                "isha": azan_row[4] if azan_row else None,
            },
            "namaz_timings": {
                "fajr": namaz_row[0] if namaz_row else None,
                "zuhr": namaz_row[1] if namaz_row else None,
                "asr": namaz_row[2] if namaz_row else None,
                "maghrib": namaz_row[3] if namaz_row else None,
                "isha": namaz_row[4] if namaz_row else None,
            }
        })

    db.close()

    return Response(subscriptions)


# @api_view(['POST'])
# def subscribe_user_to_mosque(request):
#     data = request.data
#     user_id = data.get('user_id')
#     mosque_id = data.get('mosque_id')
#     preferred = data.get('preferred', False)

#     db = get_db_connection()
#     cursor = db.cursor()

#     # If preferred is True, unset preferred from all others
#     if preferred:
#         cursor.execute("""
#             UPDATE user_subscription SET preferred = FALSE WHERE user_id = %s
#         """, (user_id,))

#     # Insert or update the subscription
#     cursor.execute("""
#         INSERT INTO user_subscription (user_id, mosque_id, preferred)
#         VALUES (%s, %s, %s)
#         ON DUPLICATE KEY UPDATE preferred = VALUES(preferred)
#     """, (user_id, mosque_id, preferred))

#     db.commit()
#     db.close()

#     return Response({"message": "User subscribed successfully"})

@api_view(['POST'])
def subscribe_user_to_mosque(request):
    data = request.data
    user_id = data.get('user_id')
    mosque_id = data.get('mosque_id')
    preferred = data.get('preferred', False)

    db = get_db_connection()
    cursor = db.cursor()

    # Check if user already has any subscription
    cursor.execute("SELECT COUNT(*) FROM user_subscription WHERE user_id = %s", (user_id,))
    (subscription_count,) = cursor.fetchone()

    if subscription_count == 0:
        preferred = True  # First time user, set preferred to True

    # If preferred is True, unset preferred from all other mosques
    if preferred:
        cursor.execute("""
            UPDATE user_subscription SET preferred = FALSE WHERE user_id = %s
        """, (user_id,))

    # Insert or update the subscription
    cursor.execute("""
        INSERT INTO user_subscription (user_id, mosque_id, preferred)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE preferred = VALUES(preferred)
    """, (user_id, mosque_id, preferred))

    db.commit()
    db.close()

    return Response({"message": "User subscribed successfully"})


@api_view(['GET'])
def get_user_preferred_mosque(request, user_id):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        SELECT m.mosque_id, m.name
        FROM user_subscription us
        JOIN mosque m ON us.mosque_id = m.mosque_id
        WHERE us.user_id = %s AND us.preferred = TRUE
    """, (user_id,))
    row = cursor.fetchone()

    if not row:
        db.close()
        return Response({"error": "No preferred mosque set"}, status=404)

    mosque_id, mosque_name = row

    # Fetch azan and namaz timings
    cursor.execute("""
        SELECT fajr, zuhr, asr, maghrib, isha FROM azan_timings
        WHERE mosque_id = %s
    """, (mosque_id,))
    azan = cursor.fetchone()

    cursor.execute("""
        SELECT fajr, zuhr, asr, maghrib, isha FROM namaz_timings
        WHERE mosque_id = %s
    """, (mosque_id,))
    namaz = cursor.fetchone()

    db.close()

    return Response({
        "mosque_id": mosque_id,
        "mosque_name": mosque_name,
        "azan_timings": {
            "fajr": (azan[0]) if azan else None,
            "zuhr": (azan[1]) if azan else None,
            "asr": (azan[2]) if azan else None,
            "maghrib": (azan[3]) if azan else None,
            "isha": (azan[4]) if azan else None
        },
        "namaz_timings": {
            "fajr": (namaz[0]) if namaz else None,
            "zuhr": (namaz[1]) if namaz else None,
            "asr": (namaz[2]) if namaz else None,
            "maghrib": (namaz[3]) if namaz else None,
            "isha": (namaz[4]) if namaz else None
        }
    })

@api_view(['PATCH'])
def update_preferred_mosque(request, user_id):
    mosque_id = request.data.get("mosque_id")
    if not mosque_id:
        return Response({"error": "mosque_id is required"}, status=400)

    db = get_db_connection()
    cursor = db.cursor()

    # Unset all preferred
    cursor.execute("""
        UPDATE user_subscription
        SET preferred = FALSE
        WHERE user_id = %s
    """, (user_id,))

    # Set the new preferred mosque
    cursor.execute("""
        UPDATE user_subscription
        SET preferred = TRUE
        WHERE user_id = %s AND mosque_id = %s
    """, (user_id, mosque_id))

    db.commit()
    db.close()

    return Response({"message": "Preferred mosque updated successfully"})
