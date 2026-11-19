import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_leaders_tier.g.dart';

/// Institution Detail Leaders Tier
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailLeadersTier {
  const InsightsInstitutionDetailLeadersTier({required this.code, required this.label, this.parent});
  final String code;
  final String label;
  final String? parent;

  factory InsightsInstitutionDetailLeadersTier.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailLeadersTierFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailLeadersTierToJson(this);
}
