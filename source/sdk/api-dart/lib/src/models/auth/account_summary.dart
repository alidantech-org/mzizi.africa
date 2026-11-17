import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/auth/account_status.dart';
import 'package:mzizi_api/src/enums/auth/auth_actor_kind.dart';

part 'account_summary.g.dart';

/// Account Summary
@JsonSerializable(includeIfNull: false)
class AuthAccountSummary {
  const AuthAccountSummary({required this.actorKind, required this.displayName, required this.id, required this.status});
  final AuthAuthActorKind actorKind;
  final String displayName;
  final String id;
  final AuthAccountStatus status;

  factory AuthAccountSummary.fromJson(Map<String, dynamic> json) => _$AuthAccountSummaryFromJson(json);

  Map<String, dynamic> toJson() => _$AuthAccountSummaryToJson(this);
}
