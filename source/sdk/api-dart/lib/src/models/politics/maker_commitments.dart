import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'maker_commitments.g.dart';

/// Maker Commitments
@JsonSerializable(includeIfNull: false)
class PoliticsMakerCommitments {
  const PoliticsMakerCommitments({this.limit, required this.makerId, this.offset});
  final int? limit;
  final String makerId;
  final int? offset;

  factory PoliticsMakerCommitments.fromJson(Map<String, dynamic> json) => _$PoliticsMakerCommitmentsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsMakerCommitmentsToJson(this);
}
