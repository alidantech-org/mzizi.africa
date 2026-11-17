import 'package:json_annotation/json_annotation.dart';

part 'institution_key.g.dart';

/// Institution Key
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionKey {
  const GovernanceInstitutionKey({required this.institutionId});
  final String institutionId;

  factory GovernanceInstitutionKey.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionKeyFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionKeyToJson(this);
}
