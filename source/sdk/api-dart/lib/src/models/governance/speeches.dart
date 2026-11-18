import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/bills.dart';
import 'package:mzizi_api/src/models/governance/hansards.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/governance/motions.dart';
import 'package:mzizi_api/src/models/governance/sittings.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'speeches.g.dart';

/// One member's contribution at a sitting as recorded in the Hansard: a speech, question, answer, statement or ruling. The full text, when stored, is a content row about this speech.
@JsonSerializable(includeIfNull: false)
class GovernanceSpeeches {
  const GovernanceSpeeches({
    this.billId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.hansardId,
    required this.holderId,
    required this.id,
    this.motionId,
    this.pageReference,
    required this.position,
    required this.sittingId,
    this.sourceCitationId,
    required this.speechKindId,
    this.summary,
    required this.updatedAt,
    required this.version,
    this.wordCount,
  });
  final String? billId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? hansardId;
  final String holderId;
  final String id;
  final String? motionId;
  final String? pageReference;
  final int position;
  final String sittingId;
  final String? sourceCitationId;
  final String speechKindId;
  final String? summary;
  final DateTime updatedAt;
  final int version;
  final int? wordCount;

  factory GovernanceSpeeches.fromJson(Map<String, dynamic> json) => _$GovernanceSpeechesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceSpeechesToJson(this);
}
