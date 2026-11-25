import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/delegations.dart';
import 'package:mzizi_api/src/models/auth/roles.dart';

part 'allowances.g.dart';

/// The security ceiling of a delegation: the roles a delegate may receive through it.
@JsonSerializable(includeIfNull: false)
class AuthAllowances {
  const AuthAllowances({required this.delegationId, required this.roleId});
  final String delegationId;
  final String roleId;

  factory AuthAllowances.fromJson(Map<String, dynamic> json) => _$AuthAllowancesFromJson(json);

  Map<String, dynamic> toJson() => _$AuthAllowancesToJson(this);
}
