import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/push_provider.dart';
import 'package:mzizi_api/src/models/community/devices.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'tokens.g.dart';

/// A push notification token of a device.
@JsonSerializable(includeIfNull: false)
class CommunityTokens {
  const CommunityTokens({
    required this.createdAt,
    this.deletedAt,
    required this.deviceId,
    required this.enabledAt,
    required this.id,
    required this.provider,
    this.revokedAt,
    required this.token,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String deviceId;
  final DateTime enabledAt;
  final String id;
  final CommunityPushProvider provider;
  final DateTime? revokedAt;
  final String token;
  final DateTime updatedAt;
  final int version;

  factory CommunityTokens.fromJson(Map<String, dynamic> json) => _$CommunityTokensFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityTokensToJson(this);
}
