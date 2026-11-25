import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/place_entry.dart';

part 'place_at_point.g.dart';

/// Place At Point
@JsonSerializable(includeIfNull: false)
class GeographyPlaceAtPoint {
  const GeographyPlaceAtPoint({required this.places});
  final List<GeographyPlaceEntry> places;

  factory GeographyPlaceAtPoint.fromJson(Map<String, dynamic> json) => _$GeographyPlaceAtPointFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyPlaceAtPointToJson(this);
}
