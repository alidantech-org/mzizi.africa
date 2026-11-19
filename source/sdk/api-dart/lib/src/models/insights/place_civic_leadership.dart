import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_civic_leadership_evidence.dart';

part 'place_civic_leadership.g.dart';

/// Place Civic Leadership
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivicLeadership {
  const InsightsPlaceCivicLeadership({
    required this.evidence,
    required this.holderId,
    required this.leaderSlug,
    this.leftOfficeOn,
    required this.officeCode,
    required this.officeTitle,
    this.partyName,
    required this.personName,
    this.portrait,
    required this.tookOfficeOn,
    required this.unitFeatureId,
    required this.unitName,
  });
  final List<InsightsPlaceCivicLeadershipEvidence> evidence;
  final String holderId;
  final String leaderSlug;
  final String? leftOfficeOn;
  final String officeCode;
  final String officeTitle;
  final String? partyName;
  final String personName;
  final Object? portrait;
  final String tookOfficeOn;
  final String unitFeatureId;
  final String unitName;

  factory InsightsPlaceCivicLeadership.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicLeadershipFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicLeadershipToJson(this);
}
