import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'rank_row.g.dart';

/// Rank Row
@JsonSerializable(includeIfNull: false)
class FrontendRankRow {
  const FrontendRankRow({required this.name, required this.place, this.rank, required this.status, this.value});
  final SharedLocalizedText name;
  final String place;
  final int? rank;
  final SharedFigureStatus status;
  final double? value;

  factory FrontendRankRow.fromJson(Map<String, dynamic> json) => _$FrontendRankRowFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendRankRowToJson(this);
}
