import 'package:json_annotation/json_annotation.dart';

part 'office_key.g.dart';

/// Office Key
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeKey {
  const GovernanceOfficeKey({required this.code});
  final String code;

  factory GovernanceOfficeKey.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeKeyFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeKeyToJson(this);
}
