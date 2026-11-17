import 'package:json_annotation/json_annotation.dart';
import 'feature_entry.dart';

part 'feature_collection.g.dart';

/// Feature Collection
@JsonSerializable(includeIfNull: false)
class FeatureCollection {
  const FeatureCollection({
    required this.features,
  });
  final List<FeatureEntry> features;

  factory FeatureCollection.fromJson(Map<String, dynamic> json) => _$FeatureCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$FeatureCollectionToJson(this);
}