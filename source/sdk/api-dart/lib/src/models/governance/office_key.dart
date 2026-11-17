import 'package:json_annotation/json_annotation.dart';

part 'office_key.g.dart';

/// Office Key
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeKey {
  const GovernanceOfficeKey({required this.officeId});
  final String officeId;

  factory GovernanceOfficeKey.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeKeyFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeKeyToJson(this);
}
