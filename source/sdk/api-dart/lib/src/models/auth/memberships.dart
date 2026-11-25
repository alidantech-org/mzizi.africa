import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/auth/membership_status.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/shared/identified.dart';

part 'memberships.g.dart';

/// An account's membership of an institution, verified and revocable with attribution.
@JsonSerializable(includeIfNull: false)
class AuthMemberships {
  const AuthMemberships({
    required this.accountId,
    this.endsAt,
    required this.id,
    required this.institutionId,
    this.revokedAt,
    this.revokedBy,
    this.startsAt,
    required this.status,
    this.verifiedAt,
    this.verifiedBy,
  });
  final String accountId;
  final DateTime? endsAt;
  final String id;
  final String institutionId;
  final DateTime? revokedAt;
  final String? revokedBy;
  final DateTime? startsAt;
  final AuthMembershipStatus status;
  final DateTime? verifiedAt;
  final String? verifiedBy;

  factory AuthMemberships.fromJson(Map<String, dynamic> json) => _$AuthMembershipsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthMembershipsToJson(this);
}
