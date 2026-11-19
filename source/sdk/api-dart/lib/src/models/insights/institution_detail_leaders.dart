import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_leaders_how.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_leaders_tier.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_leaders_unit.dart';

part 'institution_detail_leaders.g.dart';

/// Institution Detail Leaders
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailLeaders {
  const InsightsInstitutionDetailLeaders({
    required this.holderId,
    required this.how,
    required this.leaderSlug,
    required this.name,
    required this.officeCode,
    this.party,
    required this.photo,
    required this.since,
    required this.tier,
    this.unit,
  });
  final String holderId;
  final InsightsInstitutionDetailLeadersHow how;
  final String leaderSlug;
  final String name;
  final String officeCode;
  final String? party;
  final String photo;
  final String since;
  final InsightsInstitutionDetailLeadersTier tier;
  final InsightsInstitutionDetailLeadersUnit? unit;

  factory InsightsInstitutionDetailLeaders.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailLeadersFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailLeadersToJson(this);
}
