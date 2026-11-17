import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/feature_entry_names.dart';

part 'feature_entry.g.dart';

/// Feature Entry
@JsonSerializable(includeIfNull: false)
class GeographyFeatureEntry {
  const GeographyFeatureEntry({
    required this.code,
    required this.featureId,
    required this.featureTypeId,
    required this.names,
    this.validFrom,
    this.validUntil,
  });
  final String code;
  final String featureId;
  final String featureTypeId;
  final List<GeographyFeatureEntryNames> names;
  final DateTime? validFrom;
  final DateTime? validUntil;

  factory GeographyFeatureEntry.fromJson(Map<String, dynamic> json) => _$GeographyFeatureEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureEntryToJson(this);
}
