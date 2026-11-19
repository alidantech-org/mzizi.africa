import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/governance/sittings.dart';
import 'package:mzizi_api/src/models/governance/speeches.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/topic.dart';
import 'package:mzizi_api/src/models/reference/unit.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'promises.g.dart';

/// Something a leader said they would do, with where and when, what was promised and its checked status. 'No record found' is a status backed by source coverage, never an empty cell.
@JsonSerializable(includeIfNull: false)
class GovernancePromises {
  const GovernancePromises({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.dueOn,
    required this.id,
    required this.madeOn,
    this.makerHolderId,
    this.makerIndividualId,
    this.occurrenceId,
    this.officeId,
    this.placeFeatureId,
    this.quantity,
    this.sittingId,
    this.sourceCitationId,
    this.speechId,
    required this.statement,
    required this.statusAsOf,
    required this.statusId,
    this.topicId,
    this.unitId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? dueOn;
  final String id;
  final DateTime madeOn;
  final String? makerHolderId;
  final String? makerIndividualId;
  final String? occurrenceId;
  final String? officeId;
  final String? placeFeatureId;
  final double? quantity;
  final String? sittingId;
  final String? sourceCitationId;
  final String? speechId;
  final String statement;
  final DateTime statusAsOf;
  final String statusId;
  final String? topicId;
  final String? unitId;
  final DateTime updatedAt;
  final int version;

  factory GovernancePromises.fromJson(Map<String, dynamic> json) => _$GovernancePromisesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernancePromisesToJson(this);
}
