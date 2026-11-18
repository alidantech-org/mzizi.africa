import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/terms.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'bills.g.dart';

/// A proposed law from introduction to enactment. Stages record each reading, committee, assent and publication; the enacted law is a legal instrument.
@JsonSerializable(includeIfNull: false)
class GovernanceBills {
  const GovernanceBills({
    required this.billKindId,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.institutionId,
    this.instrumentId,
    this.sourceCitationId,
    this.sponsorHolderId,
    required this.statusId,
    this.summary,
    this.termId,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String billKindId;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String institutionId;
  final String? instrumentId;
  final String? sourceCitationId;
  final String? sponsorHolderId;
  final String statusId;
  final String? summary;
  final String? termId;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory GovernanceBills.fromJson(Map<String, dynamic> json) => _$GovernanceBillsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceBillsToJson(this);
}
