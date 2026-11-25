import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/attestation_status.dart';
import 'package:mzizi_api/src/enums/community/platform.dart';
import 'package:mzizi_api/src/models/community/actors.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'devices.g.dart';

/// A device an actor uses.
@JsonSerializable(includeIfNull: false)
class CommunityDevices {
  const CommunityDevices({
    required this.actorId,
    this.appVersion,
    required this.attestation,
    required this.createdAt,
    this.deletedAt,
    required this.fingerprintHash,
    required this.firstSeenAt,
    required this.id,
    required this.lastSeenAt,
    required this.platform,
    required this.updatedAt,
    required this.version,
  });
  final String actorId;
  final String? appVersion;
  final CommunityAttestationStatus attestation;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String fingerprintHash;
  final DateTime firstSeenAt;
  final String id;
  final DateTime lastSeenAt;
  final CommunityPlatform platform;
  final DateTime updatedAt;
  final int version;

  factory CommunityDevices.fromJson(Map<String, dynamic> json) => _$CommunityDevicesFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityDevicesToJson(this);
}
