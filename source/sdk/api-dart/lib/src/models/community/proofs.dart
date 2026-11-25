import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/location_check.dart';
import 'package:mzizi_api/src/models/community/actors.dart';
import 'package:mzizi_api/src/models/community/devices.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'proofs.g.dart';

/// A location check that a contribution was made from where it claims.
@JsonSerializable(includeIfNull: false)
class CommunityProofs {
  const CommunityProofs({
    this.accuracyMeters,
    required this.actorId,
    this.attestationOk,
    required this.check,
    this.coarseCell,
    required this.createdAt,
    this.deletedAt,
    required this.deviceId,
    this.headerAgrees,
    required this.id,
    this.matchedFeatureId,
    required this.mockLocationDetected,
    required this.recordedAt,
    this.travelOk,
    required this.trustScore,
    required this.updatedAt,
    required this.version,
  });
  final int? accuracyMeters;
  final String actorId;
  final bool? attestationOk;
  final CommunityLocationCheck check;
  final String? coarseCell;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String deviceId;
  final bool? headerAgrees;
  final String id;
  final String? matchedFeatureId;
  final bool mockLocationDetected;
  final DateTime recordedAt;
  final bool? travelOk;
  final double trustScore;
  final DateTime updatedAt;
  final int version;

  factory CommunityProofs.fromJson(Map<String, dynamic> json) => _$CommunityProofsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityProofsToJson(this);
}
