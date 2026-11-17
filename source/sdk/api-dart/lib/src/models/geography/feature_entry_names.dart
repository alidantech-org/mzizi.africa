import 'package:json_annotation/json_annotation.dart';

part 'feature_entry_names.g.dart';

/// Feature Entry Names
@JsonSerializable(includeIfNull: false)
class GeographyFeatureEntryNames {
  const GeographyFeatureEntryNames({this.languageTag, required this.name});
  final String? languageTag;
  final String name;

  factory GeographyFeatureEntryNames.fromJson(Map<String, dynamic> json) => _$GeographyFeatureEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureEntryNamesToJson(this);
}
