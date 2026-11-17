import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_created.dart';

part 'roles.g.dart';

/// Named permission bundle with a policy version; protected roles cannot be edited away.
@JsonSerializable(includeIfNull: false)
class AuthRoles {
  const AuthRoles({
    required this.code,
    required this.createdAt,
    this.description,
    required this.id,
    this.managingInstitutionRefId,
    required this.policyVersion,
    required this.protected,
    this.retiredAt,
    required this.title,
  });
  final String code;
  final DateTime createdAt;
  final String? description;
  final String id;
  final String? managingInstitutionRefId;
  final String policyVersion;
  final bool protected;
  final DateTime? retiredAt;
  final String title;

  factory AuthRoles.fromJson(Map<String, dynamic> json) => _$AuthRolesFromJson(json);

  Map<String, dynamic> toJson() => _$AuthRolesToJson(this);
}
