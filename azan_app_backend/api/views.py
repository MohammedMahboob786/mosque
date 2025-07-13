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


@api_view(['POST'])
def subscribe_user_to_mosque(request):
    data = request.data
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO user_subscription (user_id, mosque_id)
        VALUES (%s, %s)
    """, (
        data.get('user_id'),
        data.get('mosque_id')
    ))

    db.commit()
    db.close()

    return Response({"message": "User subscribed successfully"})
