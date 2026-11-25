import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/auth/code_channel.dart';
import 'package:mzizi_api/src/enums/auth/code_purpose.dart';
import 'package:mzizi_api/src/models/auth/logins.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'codes.g.dart';

/// A one-time sign-up or sign-in code.
@JsonSerializable(includeIfNull: false)
class AuthCodes {
  const AuthCodes({
    required this.attempts,
    required this.channel,
    this.consumedAt,
    required this.createdAt,
    required this.digest,
    required this.expiresAt,
    required this.id,
    this.loginId,
    required this.purpose,
    this.value,
  });
  final int attempts;
  final AuthCodeChannel channel;
  final DateTime? consumedAt;
  final DateTime createdAt;
  final String digest;
  final DateTime expiresAt;
  final String id;
  final String? loginId;
  final AuthCodePurpose purpose;
  final String? value;

  factory AuthCodes.fromJson(Map<String, dynamic> json) => _$AuthCodesFromJson(json);

  Map<String, dynamic> toJson() => _$AuthCodesToJson(this);
}
