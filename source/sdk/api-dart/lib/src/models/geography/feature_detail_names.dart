import 'package:json_annotation/json_annotation.dart';

part 'feature_detail_names.g.dart';

/// Feature Detail Names
@JsonSerializable(includeIfNull: false)
class GeographyFeatureDetailNames {
  const GeographyFeatureDetailNames({required this.languageId, required this.name});
  final String languageId;
  final String name;

  factory GeographyFeatureDetailNames.fromJson(Map<String, dynamic> json) => _$GeographyFeatureDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureDetailNamesToJson(this);
}
