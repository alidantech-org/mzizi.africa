import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/place_entry.dart';

part 'place_collection.g.dart';

/// Place Collection
@JsonSerializable(includeIfNull: false)
class GeographyPlaceCollection {
  const GeographyPlaceCollection({required this.places});
  final List<GeographyPlaceEntry> places;

  factory GeographyPlaceCollection.fromJson(Map<String, dynamic> json) => _$GeographyPlaceCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyPlaceCollectionToJson(this);
}
