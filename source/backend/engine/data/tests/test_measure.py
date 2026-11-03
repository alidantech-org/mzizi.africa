import json
import math

from mzizi_data import measure

R = 6371.0088  # mean Earth radius in km; the ellipsoid differs from the sphere by well under 1 percent for these boxes


def box(lon, lat, size=1.0):
    ring = [[lon, lat], [lon + size, lat], [lon + size, lat + size], [lon, lat + size], [lon, lat]]
    return json.dumps({"type": "Polygon", "coordinates": [ring]})


def spherical_area(lat1, lat2, dlon):
    return R * R * math.radians(dlon) * (math.sin(math.radians(lat2)) - math.sin(math.radians(lat1)))


def test_square_degree_on_the_equator(conn):
    area, perimeter = measure.geodesic_km(conn, box(36.0, 0.0))
    assert abs(area - spherical_area(0, 1, 1)) / spherical_area(0, 1, 1) < 0.01
    assert 12_300 < area < 12_400  # about 111.3 km on each side
    assert 440 < perimeter < 450


def test_square_degree_at_high_latitude_is_smaller(conn):
    equator, _ = measure.geodesic_km(conn, box(36.0, 0.0))
    north, _ = measure.geodesic_km(conn, box(10.0, 60.0))
    expected = spherical_area(60, 61, 1)
    assert abs(north - expected) / expected < 0.01
    assert north < equator * 0.55  # cos(60.5 degrees) is about 0.49


def test_planar_degrees_would_be_wrong_but_geodesic_is_not(conn):
    # a unit square in degrees has "area 1" in the plane; the geodesic area is thousands of square kilometres
    area, _ = measure.geodesic_km(conn, box(0.0, 0.0))
    assert area > 10_000
