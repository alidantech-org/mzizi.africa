import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/auth/account_status.dart';
import 'package:mzizi_api/src/enums/auth/auth_actor_kind.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'accounts.g.dart';

/// A sign-in principal for a person, service or agent.
@JsonSerializable(includeIfNull: false)
class AuthAccounts {
  const AuthAccounts({
    required this.actorKind,
    required this.createdAt,
    this.disabledAt,
    required this.displayName,
    required this.id,
    this.individualId,
    this.lastAuthenticatedAt,
    required this.status,
  });
  final AuthAuthActorKind actorKind;
  final DateTime createdAt;
  final DateTime? disabledAt;
  final String displayName;
  final String id;
  final String? individualId;
  final DateTime? lastAuthenticatedAt;
  final AuthAccountStatus status;

  factory AuthAccounts.fromJson(Map<String, dynamic> json) => _$AuthAccountsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthAccountsToJson(this);
}
