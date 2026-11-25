import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/politics/commitment_kind.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/politics/manifestos.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/reference/units.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'commitments.g.dart';

/// A promise someone with public power made, in their original words, with its status.
@JsonSerializable(includeIfNull: false)
class PoliticsCommitments {
  const PoliticsCommitments({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.dueOn,
    this.fromYear,
    required this.id,
    required this.kind,
    required this.languageId,
    this.madeOn,
    required this.makerId,
    this.manifestoId,
    this.occurrenceId,
    this.officeId,
    this.placeId,
    this.quantity,
    this.speechId,
    required this.statement,
    this.statusAsOf,
    required this.statusTerm,
    this.toYear,
    this.topicTerm,
    this.unitId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? dueOn;
  final int? fromYear;
  final String id;
  final PoliticsCommitmentKind kind;
  final String languageId;
  final DateTime? madeOn;
  final String makerId;
  final String? manifestoId;
  final String? occurrenceId;
  final String? officeId;
  final String? placeId;
  final double? quantity;
  final String? speechId;
  final String statement;
  final DateTime? statusAsOf;
  final String statusTerm;
  final int? toYear;
  final String? topicTerm;
  final String? unitId;
  final DateTime updatedAt;
  final int version;

  factory PoliticsCommitments.fromJson(Map<String, dynamic> json) => _$PoliticsCommitmentsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsCommitmentsToJson(this);
}
