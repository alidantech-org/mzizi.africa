import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/feature_entry.dart';

part 'feature_collection.g.dart';

/// Feature Collection
@JsonSerializable(includeIfNull: false)
class GeographyFeatureCollection {
  const GeographyFeatureCollection({required this.features});
  final List<GeographyFeatureEntry> features;

  factory GeographyFeatureCollection.fromJson(Map<String, dynamic> json) => _$GeographyFeatureCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureCollectionToJson(this);
}
