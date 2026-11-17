import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/office_detail_holders.dart';

part 'office_detail.g.dart';

/// Office Detail
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeDetail {
  const GovernanceOfficeDetail({
    required this.code,
    required this.holders,
    required this.id,
    required this.institutionId,
    required this.kind,
    this.unitFeatureId,
  });
  final String code;
  final List<GovernanceOfficeDetailHolders> holders;
  final String id;
  final String institutionId;
  final String kind;
  final String? unitFeatureId;

  factory GovernanceOfficeDetail.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeDetailFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeDetailToJson(this);
}
