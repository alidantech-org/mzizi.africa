import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legislature/bills.dart';
import 'package:mzizi_api/src/models/legislature/motions.dart';
import 'package:mzizi_api/src/models/legislature/sittings.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'agenda.g.dart';

/// One item of a sitting's order paper.
@JsonSerializable(includeIfNull: false)
class LegislatureAgenda {
  const LegislatureAgenda({
    this.billId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.kindTerm,
    this.motionId,
    required this.position,
    required this.sittingId,
    required this.updatedAt,
    required this.version,
  });
  final String? billId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String kindTerm;
  final String? motionId;
  final int position;
  final String sittingId;
  final DateTime updatedAt;
  final int version;

  factory LegislatureAgenda.fromJson(Map<String, dynamic> json) => _$LegislatureAgendaFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureAgendaToJson(this);
}
