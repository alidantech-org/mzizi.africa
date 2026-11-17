import 'package:json_annotation/json_annotation.dart';

part 'feature_entry_names.g.dart';

/// Feature Entry Names
@JsonSerializable(includeIfNull: false)
class GeographyFeatureEntryNames {
  const GeographyFeatureEntryNames({required this.languageId, required this.name});
  final String languageId;
  final String name;

  factory GeographyFeatureEntryNames.fromJson(Map<String, dynamic> json) => _$GeographyFeatureEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureEntryNamesToJson(this);
}
