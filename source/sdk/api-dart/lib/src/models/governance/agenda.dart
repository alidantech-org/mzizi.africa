import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/bills.dart';
import 'package:mzizi_api/src/models/governance/motions.dart';
import 'package:mzizi_api/src/models/governance/sittings.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'agenda.g.dart';

/// One item of a sitting's order paper, in order, with the bill or motion it is about.
@JsonSerializable(includeIfNull: false)
class GovernanceAgenda {
  const GovernanceAgenda({
    required this.agendaKindId,
    this.billId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.motionId,
    required this.position,
    required this.sittingId,
    this.sourceCitationId,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String agendaKindId;
  final String? billId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? motionId;
  final int position;
  final String sittingId;
  final String? sourceCitationId;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory GovernanceAgenda.fromJson(Map<String, dynamic> json) => _$GovernanceAgendaFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceAgendaToJson(this);
}
