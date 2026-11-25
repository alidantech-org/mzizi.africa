import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/project_detail_contracts.dart';
import 'package:mzizi_api/src/models/civic/project_detail_names.dart';
import 'package:mzizi_api/src/models/civic/project_detail_sites.dart';

part 'project_detail.g.dart';

/// Project Detail
@JsonSerializable(includeIfNull: false)
class CivicProjectDetail {
  const CivicProjectDetail({
    required this.code,
    required this.contracts,
    this.fromYear,
    this.implementerId,
    this.institutionId,
    required this.names,
    required this.projectId,
    required this.sites,
    this.sponsorId,
    required this.statusTerm,
    this.toYear,
  });
  final String code;
  final List<CivicProjectDetailContracts> contracts;
  final int? fromYear;
  final String? implementerId;
  final String? institutionId;
  final List<CivicProjectDetailNames> names;
  final String projectId;
  final List<CivicProjectDetailSites> sites;
  final String? sponsorId;
  final String statusTerm;
  final int? toYear;

  factory CivicProjectDetail.fromJson(Map<String, dynamic> json) => _$CivicProjectDetailFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectDetailToJson(this);
}
