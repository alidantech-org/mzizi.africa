import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'invitations.g.dart';

/// A single-use invitation to an institution.
@JsonSerializable(includeIfNull: false)
class AuthInvitations {
  const AuthInvitations({
    this.acceptedAccountId,
    this.acceptedAt,
    required this.createdAt,
    this.expiresAt,
    required this.id,
    required this.institutionId,
    required this.intendedEmail,
    required this.invitedBy,
    this.revokedAt,
    required this.tokenDigest,
  });
  final String? acceptedAccountId;
  final DateTime? acceptedAt;
  final DateTime createdAt;
  final DateTime? expiresAt;
  final String id;
  final String institutionId;
  final String intendedEmail;
  final String invitedBy;
  final DateTime? revokedAt;
  final String tokenDigest;

  factory AuthInvitations.fromJson(Map<String, dynamic> json) => _$AuthInvitationsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthInvitationsToJson(this);
}
