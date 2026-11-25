import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'indicator_window.g.dart';

/// Indicator Window
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorWindow {
  const StatisticsIndicatorWindow({this.limit, this.offset, this.topicTerm});
  final int? limit;
  final int? offset;
  final String? topicTerm;

  factory StatisticsIndicatorWindow.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorWindowFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorWindowToJson(this);
}
