import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legislature/text_origin.dart';
import 'package:mzizi_api/src/enums/legislature/text_status.dart';
import 'package:mzizi_api/src/models/legislature/agenda.dart';
import 'package:mzizi_api/src/models/legislature/bills.dart';
import 'package:mzizi_api/src/models/legislature/motions.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'summaries.g.dart';

/// A title or summary of a bill, motion, speech or agenda item in one language.
@JsonSerializable(includeIfNull: false)
class LegislatureSummaries {
  const LegislatureSummaries({
    this.agendaId,
    this.billId,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.languageId,
    this.motionId,
    required this.origin,
    this.speechId,
    required this.status,
    required this.text,
    required this.updatedAt,
    required this.version,
  });
  final String? agendaId;
  final String? billId;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String languageId;
  final String? motionId;
  final LegislatureTextOrigin origin;
  final String? speechId;
  final LegislatureTextStatus status;
  final String text;
  final DateTime updatedAt;
  final int version;

  factory LegislatureSummaries.fromJson(Map<String, dynamic> json) => _$LegislatureSummariesFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureSummariesToJson(this);
}
