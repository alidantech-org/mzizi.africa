import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/geography/feature_entry_names.dart';

part 'feature_entry.g.dart';

/// Feature Entry
@JsonSerializable(includeIfNull: false)
class GeographyFeatureEntry {
  const GeographyFeatureEntry({
    required this.code,
    required this.featureId,
    required this.featureTypeId,
    this.fromToPrecision,
    this.fromYear,
    required this.names,
    this.toYear,
  });
  final String code;
  final String featureId;
  final String featureTypeId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final List<GeographyFeatureEntryNames> names;
  final int? toYear;

  factory GeographyFeatureEntry.fromJson(Map<String, dynamic> json) => _$GeographyFeatureEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureEntryToJson(this);
}
