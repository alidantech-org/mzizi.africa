from mzizi_data.imports.geo_admin import build_units


def square(x, y, size=1.0):
    return {"type": "Polygon", "coordinates": [[[x, y], [x + size, y], [x + size, y + size], [x, y + size], [x, y]]]}


def feat(sid, name, geometry):
    return {"properties": {"shapeID": sid, "shapeName": name}, "geometry": geometry}


def test_parents_come_from_geometry_and_repeated_names_stay_distinct():
    levels = {
        0: [feat("c", "Kenya", square(0, 0, 10))],
        1: [feat("a", "Alpha", square(0, 0, 5)), feat("b", "Beta", square(5, 0, 5))],
        2: [feat("w1", "Central", square(1, 1, 1)), feat("w2", "Central", square(6, 1, 1)), feat("w3", "Central", square(6.5, 3, 0.5))],
    }
    units, problems = build_units(levels, "ke", "Kenya")
    codes = {u.code: u.parent_code for u in units}
    assert codes["ke/alpha/central"] == "ke/alpha" and codes["ke/beta/central"] == "ke/beta"
    assert "ke/beta/central-2" in codes and any("different shape" in p for p in problems)  # same name, same parent, other shape: kept and reported


def test_duplicate_shapes_are_dropped_and_reported():
    levels = {
        0: [feat("c", "Kenya", square(0, 0, 10))],
        1: [feat("a", "Alpha", square(0, 0, 5)), feat("a", "Alpha", square(0, 0, 5)), feat("a2", "Alpha", square(0.01, 0.01, 4.99))],
    }
    units, problems = build_units(levels, "ke", "Kenya")
    assert [u.code for u in units if u.level == 1] == ["ke/alpha"]
    assert any("repeated shape id" in p for p in problems) and any("almost the same area" in p for p in problems)


def test_a_point_outside_every_parent_uses_the_nearest_and_says_so():
    levels = {0: [feat("c", "Kenya", square(0, 0, 10))], 1: [feat("a", "Alpha", square(0, 0, 2))], 2: [feat("w", "Far", square(8, 8, 1))]}
    units, problems = build_units(levels, "ke", "Kenya")
    assert [u.parent_code for u in units if u.level == 2] == ["ke/alpha"] and any("nearest parent" in p for p in problems)


def test_the_parent_is_the_polygon_holding_most_of_the_shape_not_the_one_under_its_point():
    # A ward whose middle row lies in Alpha, with a long low arm that puts most of its area in Beta.
    ward = {"type": "Polygon", "coordinates": [[[3, 0], [10, 0], [10, 0.45], [5, 0.45], [5, 1], [3, 1], [3, 0]]]}
    from shapely.geometry import shape
    assert shape(ward).representative_point().x < 5
    levels = {0: [feat("c", "Kenya", square(0, 0, 10))], 1: [feat("a", "Alpha", square(0, 0, 5)), feat("b", "Beta", square(5, 0, 5))], 2: [feat("w", "Mixed", ward)]}
    units, problems = build_units(levels, "ke", "Kenya")
    assert [u.parent_code for u in units if u.level == 2] == ["ke/beta"] and any("most of the shape lies in Beta" in p for p in problems)
