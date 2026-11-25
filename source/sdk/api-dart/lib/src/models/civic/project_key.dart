import 'package:json_annotation/json_annotation.dart';

part 'project_key.g.dart';

/// Project Key
@JsonSerializable(includeIfNull: false)
class CivicProjectKey {
  const CivicProjectKey({required this.code});
  final String code;

  factory CivicProjectKey.fromJson(Map<String, dynamic> json) => _$CivicProjectKeyFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectKeyToJson(this);
}
