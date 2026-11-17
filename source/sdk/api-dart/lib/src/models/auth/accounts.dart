import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/auth/account_status.dart';
import 'package:mzizi_api/src/enums/auth/auth_actor_kind.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'accounts.g.dart';

/// Login principal for a person or service; identity is separate from the people and institutions it refers to.
@JsonSerializable(includeIfNull: false)
class AuthAccounts {
  const AuthAccounts({
    required this.actorKind,
    required this.createdAt,
    this.disabledAt,
    required this.displayName,
    required this.id,
    this.lastAuthenticatedAt,
    required this.personRefId,
    required this.status,
  });
  final AuthAuthActorKind actorKind;
  final DateTime createdAt;
  final DateTime? disabledAt;
  final String displayName;
  final String id;
  final DateTime? lastAuthenticatedAt;
  final String personRefId;
  final AuthAccountStatus status;

  factory AuthAccounts.fromJson(Map<String, dynamic> json) => _$AuthAccountsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthAccountsToJson(this);
}
