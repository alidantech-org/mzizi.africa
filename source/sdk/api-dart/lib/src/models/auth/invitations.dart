import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'invitations.g.dart';

/// Single-use invitation to an institution; only a digest of the token is stored.
@JsonSerializable(includeIfNull: false)
class AuthInvitations {
  const AuthInvitations({
    this.acceptedAccountId,
    this.acceptedAt,
    required this.createdAt,
    this.expiresAt,
    required this.id,
    required this.institutionRefId,
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
  final String institutionRefId;
  final String intendedEmail;
  final String invitedBy;
  final DateTime? revokedAt;
  final String tokenDigest;

  factory AuthInvitations.fromJson(Map<String, dynamic> json) => _$AuthInvitationsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthInvitationsToJson(this);
}
