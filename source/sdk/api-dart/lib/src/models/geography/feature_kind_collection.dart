import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/feature_kind.dart';

part 'feature_kind_collection.g.dart';

/// Feature Kind Collection
@JsonSerializable(includeIfNull: false)
class GeographyFeatureKindCollection {
  const GeographyFeatureKindCollection({required this.kinds});
  final List<GeographyFeatureKind> kinds;

  factory GeographyFeatureKindCollection.fromJson(Map<String, dynamic> json) => _$GeographyFeatureKindCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureKindCollectionToJson(this);
}
