import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/periods.dart';
import 'package:mzizi_api/src/models/finance/revisions.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/legislature/bills.dart';
import 'package:mzizi_api/src/models/legislature/sittings.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'motions.g.dart';

/// A motion debated at a sitting.
@JsonSerializable(includeIfNull: false)
class LegislatureMotions {
  const LegislatureMotions({
    this.billId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.instrumentId,
    required this.kindTerm,
    this.moverId,
    this.outcomeTerm,
    this.periodId,
    this.provisionId,
    this.revisionId,
    required this.sittingId,
    required this.updatedAt,
    required this.version,
  });
  final String? billId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? instrumentId;
  final String kindTerm;
  final String? moverId;
  final String? outcomeTerm;
  final String? periodId;
  final String? provisionId;
  final String? revisionId;
  final String sittingId;
  final DateTime updatedAt;
  final int version;

  factory LegislatureMotions.fromJson(Map<String, dynamic> json) => _$LegislatureMotionsFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureMotionsToJson(this);
}
