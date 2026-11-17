import 'package:json_annotation/json_annotation.dart';
import 'feature_entry_names.dart';

part 'feature_entry.g.dart';

/// Feature Entry
@JsonSerializable(includeIfNull: false)
class FeatureEntry {
  const FeatureEntry({
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
  final List<FeatureEntryNames> names;
  final DateTime? validFrom;
  final DateTime? validUntil;

  factory FeatureEntry.fromJson(Map<String, dynamic> json) => _$FeatureEntryFromJson(json);

  Map<String, dynamic> toJson() => _$FeatureEntryToJson(this);
}