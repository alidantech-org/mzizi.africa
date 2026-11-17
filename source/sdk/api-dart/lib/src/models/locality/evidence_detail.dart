import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/locality/evidence_ref.dart';
import 'package:mzizi_api/src/models/locality/media_ref.dart';

part 'evidence_detail.g.dart';

/// Evidence Detail
@JsonSerializable(includeIfNull: false)
class LocalityEvidenceDetail {
  const LocalityEvidenceDetail({
    this.editionLabel,
    required this.evidence,
    required this.files,
    this.quotedText,
    this.sourceCode,
    this.sourceId,
  });
  final String? editionLabel;
  final LocalityEvidenceRef evidence;
  final List<LocalityMediaRef> files;
  final String? quotedText;
  final String? sourceCode;
  final String? sourceId;

  factory LocalityEvidenceDetail.fromJson(Map<String, dynamic> json) => _$LocalityEvidenceDetailFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityEvidenceDetailToJson(this);
}
