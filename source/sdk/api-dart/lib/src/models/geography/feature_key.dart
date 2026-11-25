import 'package:json_annotation/json_annotation.dart';

part 'feature_key.g.dart';

/// Feature Key
@JsonSerializable(includeIfNull: false)
class GeographyFeatureKey {
  const GeographyFeatureKey({required this.code});
  final String code;

  factory GeographyFeatureKey.fromJson(Map<String, dynamic> json) => _$GeographyFeatureKeyFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureKeyToJson(this);
}
