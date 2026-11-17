import 'package:json_annotation/json_annotation.dart';

part 'feature_key.g.dart';

/// Feature Key
@JsonSerializable(includeIfNull: false)
class FeatureKey {
  const FeatureKey({
    required this.featureId,
  });
  final String featureId;

  factory FeatureKey.fromJson(Map<String, dynamic> json) => _$FeatureKeyFromJson(json);

  Map<String, dynamic> toJson() => _$FeatureKeyToJson(this);
}