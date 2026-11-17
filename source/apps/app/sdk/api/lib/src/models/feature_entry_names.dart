import 'package:json_annotation/json_annotation.dart';

part 'feature_entry_names.g.dart';

/// Feature Entry Names
@JsonSerializable(includeIfNull: false)
class FeatureEntryNames {
  const FeatureEntryNames({
    this.languageTag,
    required this.name,
  });
  final String? languageTag;
  final String name;

  factory FeatureEntryNames.fromJson(Map<String, dynamic> json) => _$FeatureEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$FeatureEntryNamesToJson(this);
}