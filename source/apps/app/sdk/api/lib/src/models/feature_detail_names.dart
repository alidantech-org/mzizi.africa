import 'package:json_annotation/json_annotation.dart';

part 'feature_detail_names.g.dart';

/// Feature Detail Names
@JsonSerializable(includeIfNull: false)
class FeatureDetailNames {
  const FeatureDetailNames({
    this.languageTag,
    required this.name,
  });
  final String? languageTag;
  final String name;

  factory FeatureDetailNames.fromJson(Map<String, dynamic> json) => _$FeatureDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$FeatureDetailNamesToJson(this);
}