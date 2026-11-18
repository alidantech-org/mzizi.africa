import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/terms.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'sittings.g.dart';

/// The legislative or deliberative record of one meeting of a public body. When and where it happened is the linked occurrence; this holds the house, term, session and what was considered.
@JsonSerializable(includeIfNull: false)
class GovernanceSittings {
  const GovernanceSittings({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.institutionId,
    required this.occurrenceId,
    this.sequenceNumber,
    this.sessionLabel,
    required this.sittingKindId,
    this.sourceCitationId,
    this.termId,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String institutionId;
  final String occurrenceId;
  final int? sequenceNumber;
  final String? sessionLabel;
  final String sittingKindId;
  final String? sourceCitationId;
  final String? termId;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory GovernanceSittings.fromJson(Map<String, dynamic> json) => _$GovernanceSittingsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceSittingsToJson(this);
}
