import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/auth/account_status.dart';
import 'package:mzizi_api/src/enums/auth/auth_actor_kind.dart';

part 'account_read.g.dart';

/// Account Read
@JsonSerializable(includeIfNull: false)
class AuthAccountRead {
  const AuthAccountRead({required this.actorKind, required this.displayName, required this.id, this.lastAuthenticatedAt, required this.status});
  final AuthAuthActorKind actorKind;
  final String displayName;
  final String id;
  final DateTime? lastAuthenticatedAt;
  final AuthAccountStatus status;

  factory AuthAccountRead.fromJson(Map<String, dynamic> json) => _$AuthAccountReadFromJson(json);

  Map<String, dynamic> toJson() => _$AuthAccountReadToJson(this);
}
